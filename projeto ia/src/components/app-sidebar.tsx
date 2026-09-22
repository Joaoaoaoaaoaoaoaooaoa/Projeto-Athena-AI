import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, MessageCircle, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import athenaLogo from "@/assets/athena-logo.png";

export type Conversation = {
  id: string;
  title: string;
  preview: string;
  date: string;
};

const initialConversations: Conversation[] = [];

type AppSidebarProps = {
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  conversations: Conversation[];
};

export function AppSidebar({
  activeId,
  onSelect,
  onNewChat,
  conversations,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Brand header */}
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <img
            src={athenaLogo}
            alt="Athena"
            width={36}
            height={36}
            className="shrink-0 rounded-lg"
            loading="lazy"
          />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-base font-semibold text-foreground">
                Athena
              </span>
              <span className="text-xs text-muted-foreground">
                Seu espaço de estudo
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* New chat button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onNewChat}
                  className="bg-athena-gradient text-primary-foreground hover:opacity-90"
                >
                  <Plus className="size-4" />
                  {!collapsed && <span>Nova conversa</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Conversation history */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Histórico</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    isActive={conv.id === activeId}
                    onClick={() => onSelect(conv.id)}
                    className="group"
                  >
                    <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                    {!collapsed && (
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium">
                          {conv.title}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {conv.preview}
                        </span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        {!collapsed && (
          <div className="rounded-lg bg-accent/50 p-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-accent-foreground">
              <Sparkles className="size-3.5" />
              IA de verdade
            </p>
            <p className="mt-1 leading-relaxed">
              A Athena responde com inteligência artificial. Ela não substitui apoio
              profissional.
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export { initialConversations };